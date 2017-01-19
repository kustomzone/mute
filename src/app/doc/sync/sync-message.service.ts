import { Injectable } from '@angular/core'
import { Identifier, IdentifierInterval, LogootSDel, LogootSAdd } from 'mute-structs'
import { Observable, Observer } from 'rxjs'

import { NetworkMessage, NetworkService } from 'doc/network'
import { RichLogootSOperation } from './RichLogootSOperation'

const pb = require('./sync_pb.js')

@Injectable()
export class SyncMessageService {

  private remoteRichLogootSOperationObservable: Observable<RichLogootSOperation>
  private remoteRichLogootSOperationObservers: Observer<RichLogootSOperation>[] = []

  constructor (private network: NetworkService) {
    this.remoteRichLogootSOperationObservable = Observable.create((observer) => {
      this.remoteRichLogootSOperationObservers.push(observer)
    })
  }

  set messageSource (source: Observable<NetworkMessage>) {
    source
    .filter((msg: NetworkMessage) => msg.service === this.constructor.name)
    .subscribe((msg: NetworkMessage) => {
      const content = new pb.Sync.deserializeBinary(msg.content)
      switch (content.getTypeCase()) {
        case pb.Sync.TypeCase.RICHLOGOOTSOP:
          this.handleRichLogootSOpMsg(content.getRichlogootsop())
          break
      }

    })
  }

  set localRichLogootSOperationSource (source: Observable<RichLogootSOperation>) {
    source.subscribe((richLogootSOp: RichLogootSOperation) => {
      const msg = this.generateRichLogootSOpMsg(richLogootSOp)
      this.network.newSend(this.constructor.name, msg.serializeBinary())
    })
  }

  get onRemoteRichLogootSOperation (): Observable<RichLogootSOperation> {
    return this.remoteRichLogootSOperationObservable
  }

  handleRichLogootSOpMsg (content: any): void {
    const richLogootSOp: RichLogootSOperation = this.deserializeRichLogootSOperation(content)

    this.remoteRichLogootSOperationObservers.forEach((observer: Observer<RichLogootSOperation>) => {
      observer.next(richLogootSOp)
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

}
