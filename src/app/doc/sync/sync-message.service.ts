import { Injectable } from '@angular/core'
import { Identifier, IdentifierInterval, LogootSDel, LogootSAdd } from 'mute-structs'
import { Observable, Observer } from 'rxjs'

import { Interval } from './Interval'
import { NetworkMessage, NetworkService } from 'doc/network'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { ServiceIdentifier } from 'helper/ServiceIdentifier'
const pb = require('./sync_pb.js')

@Injectable()
export class SyncMessageService extends ServiceIdentifier {

  private remoteQuerySyncObservable: Observable<Map<number, number>>
  private remoteQuerySyncObservers: Observer<Map<number, number>>[] = []

  private remoteQuerySyncIdObservable: Observable<number>
  private remoteQuerySyncIdObserver: Observer<number>

  private remoteRichLogootSOperationObservable: Observable<RichLogootSOperation>
  private remoteRichLogootSOperationObservers: Observer<RichLogootSOperation>[] = []

  private remoteReplySyncObservable: Observable<ReplySyncEvent>
  private remoteReplySyncObservers: Observer<ReplySyncEvent>[] = []

  constructor (private network: NetworkService) {
    super('SyncMessage')
    this.remoteQuerySyncObservable = Observable.create((observer) => {
      this.remoteQuerySyncObservers.push(observer)
    })

    this.remoteQuerySyncIdObservable = Observable.create((observer) => {
      this.remoteQuerySyncIdObserver = observer
    })

    this.remoteRichLogootSOperationObservable = Observable.create((observer) => {
      this.remoteRichLogootSOperationObservers.push(observer)
    })

    this.remoteReplySyncObservable = Observable.create((observer) => {
      this.remoteReplySyncObservers.push(observer)
    })
  }

  set localRichLogootSOperationSource (source: Observable<RichLogootSOperation>) {
    source.subscribe((richLogootSOp: RichLogootSOperation) => {
      const msg = this.generateRichLogootSOpMsg(richLogootSOp)
      this.network.send(this.id, msg.serializeBinary())
    })
  }

  set messageSource (source: Observable<NetworkMessage>) {
    source
    .filter((msg: NetworkMessage) => msg.service === this.id)
    .subscribe((msg: NetworkMessage) => {
      const content = new pb.Sync.deserializeBinary(msg.content)
      switch (content.getTypeCase()) {
        case pb.Sync.TypeCase.RICHLOGOOTSOP:
          this.handleRichLogootSOpMsg(content.getRichlogootsop())
          break
        case pb.Sync.TypeCase.QUERYSYNC:
          this.remoteQuerySyncIdObserver.next(msg.id) // Register the id of the peer
          this.handleQuerySyncMsg(content.getQuerysync())
          break
        case pb.Sync.TypeCase.REPLYSYNC:
          this.handleReplySyncMsg(content.getReplysync())
          break
      }
    })
  }

  set querySyncSource (source: Observable<Map<number, number>>) {
    source.subscribe((vector: Map<number, number>) => {
      const msg = this.generateQuerySyncMsg(vector)
      const peerId: number = this.network.members[0]
      this.network.send(this.id, msg.serializeBinary(), peerId)
    })
  }

  set replySyncSource (source: Observable<ReplySyncEvent>) {
    Observable.zip(
      source,
      this.remoteQuerySyncIdObservable,
      (replySyncEvent: ReplySyncEvent, id: number) => {
        return { id, replySyncEvent }
      })
      .subscribe(({ id, replySyncEvent}: { id: number, replySyncEvent: ReplySyncEvent }) => {
        const msg = this.generateReplySyncMsg(replySyncEvent.richLogootSOps, replySyncEvent.intervals)
        this.network.send(this.id, msg.serializeBinary(), id)
      })
  }

  get onRemoteRichLogootSOperation (): Observable<RichLogootSOperation> {
    return this.remoteRichLogootSOperationObservable
  }

  get onRemoteQuerySync (): Observable<Map<number, number>> {
    return this.remoteQuerySyncObservable
  }

  get onRemoteReplySync (): Observable<ReplySyncEvent> {
    return this.remoteReplySyncObservable
  }

  handleRichLogootSOpMsg (content: any): void {
    const richLogootSOp: RichLogootSOperation = this.deserializeRichLogootSOperation(content)

    this.remoteRichLogootSOperationObservers.forEach((observer: Observer<RichLogootSOperation>) => {
      observer.next(richLogootSOp)
    })
  }

  handleQuerySyncMsg (content: any): void {
    const vector: Map<number, number> = content.getVectorMap()
    this.remoteQuerySyncObservers.forEach((observer: Observer<Map<number, number>>) => {
      observer.next(vector)
    })
  }

  handleReplySyncMsg (content: any): void {
    const richLogootSOpsList: any[] = content.getRichlogootsopsList()
    const richLogootSOps: RichLogootSOperation[] = richLogootSOpsList.map((richLogootSOpMsg: any) => {
      return this.deserializeRichLogootSOperation(richLogootSOpMsg)
    })

    const intervals: Interval[] = content.getIntervalsList().map((interval: any) => {
      return new Interval(interval.getId(), interval.getBegin(), interval.getEnd())
    })

    const replySyncEvent: ReplySyncEvent = new ReplySyncEvent(richLogootSOps, intervals)
    this.remoteReplySyncObservers.forEach((observer: Observer<ReplySyncEvent>) => {
      observer.next(replySyncEvent)
    })
  }

  generateRichLogootSOpMsg (richLogootSOp: RichLogootSOperation): any {
    const richLogootSOperationMsg = this.serializeRichLogootSOperation(richLogootSOp)
    const msg = new pb.Sync()
    msg.setRichlogootsop(richLogootSOperationMsg)

    return msg
  }

  serializeRichLogootSOperation (richLogootSOp: RichLogootSOperation): any {
    const richLogootSOperationMsg = new pb.RichLogootSOperation()
    richLogootSOperationMsg.setId(richLogootSOp.id)
    richLogootSOperationMsg.setClock(richLogootSOp.clock)

    const logootSOp: LogootSAdd | LogootSDel = richLogootSOp.logootSOp
    if (logootSOp instanceof LogootSAdd) {
      richLogootSOperationMsg.setLogootsadd(this.generateLogootSAddMsg(logootSOp))
    } else if (logootSOp instanceof LogootSDel) {
      richLogootSOperationMsg.setLogootsdel(this.generateLogootSDelMsg(logootSOp))
    }

    return richLogootSOperationMsg
  }

  deserializeRichLogootSOperation (content: any): RichLogootSOperation {
    const id: number = content.getId()
    const clock: number = content.getClock()

    let logootSOp: LogootSAdd | LogootSDel
    if (content.hasLogootsadd()) {
      const logootSAddMsg = content.getLogootsadd()
      const identifier: Identifier = new Identifier(logootSAddMsg.getId().getBaseList(), logootSAddMsg.getId().getLast())
      logootSOp = new LogootSAdd(identifier, logootSAddMsg.getContent())
    } else {
      const logootSDelMsg: any = content.getLogootsdel()
      const lid: any = logootSDelMsg.getLidList().map( (identifier: any) => {
        return new IdentifierInterval(identifier.getBaseList(), identifier.getBegin(), identifier.getEnd())
      })
      logootSOp = new LogootSDel(lid)
    }

    return new RichLogootSOperation(id, clock, logootSOp)
  }

  generateLogootSAddMsg (logootSAdd: LogootSAdd): any {
    const identifier = new pb.Identifier()

    identifier.setBaseList(logootSAdd.id.base)
    identifier.setLast(logootSAdd.id.last)

    const logootSAddMsg = new pb.LogootSAdd()
    logootSAddMsg.setId(identifier)
    logootSAddMsg.setContent(logootSAdd.l)

    return logootSAddMsg
  }

  generateLogootSDelMsg (logootSDel: LogootSDel): any {
    const lid: any[] = logootSDel.lid.map( (id: any) => {
      const identifierInterval: any = this.generateIdentifierIntervalMsg(id)
      return identifierInterval
    })

    const logootSDelMsg = new pb.LogootSDel()
    logootSDelMsg.setLidList(lid)
    return logootSDelMsg
  }

  generateIdentifierIntervalMsg (id: IdentifierInterval): any {
    const identifierIntervalMsg = new pb.IdentifierInterval()

    identifierIntervalMsg.setBaseList(id.base)
    identifierIntervalMsg.setBegin(id.begin)
    identifierIntervalMsg.setEnd(id.end)

    return identifierIntervalMsg
  }

  generateQuerySyncMsg (vector: Map<number, number>): any {
    const querySyncMsg = new pb.QuerySync()

    const map: Map<number, number> = querySyncMsg.getVectorMap()
    vector.forEach((clock: number, id: number) => {
      map.set(id, clock)
    })

    const msg = new pb.Sync()
    msg.setQuerysync(querySyncMsg)

    return msg
  }

  generateReplySyncMsg (richLogootSOps: RichLogootSOperation[], intervals: Interval[]): any {
    const replySyncMsg = new pb.ReplySync()

    replySyncMsg.setRichlogootsopsList(richLogootSOps.map((richLogootSOp: RichLogootSOperation) => {
      return this.serializeRichLogootSOperation(richLogootSOp)
    }))

    const intervalsMsg = intervals.map((interval: Interval) => {
      const intervalMsg = new pb.Interval()
      intervalMsg.setId(interval.id)
      intervalMsg.setBegin(interval.begin)
      intervalMsg.setEnd(interval.end)
      return intervalMsg
    })
    replySyncMsg.setIntervalsList(intervalsMsg)

    const msg = new pb.Sync()
    msg.setReplysync(replySyncMsg)

    return msg
  }

}