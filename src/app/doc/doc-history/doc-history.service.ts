import { Injectable } from '@angular/core'
import { Observable, Observer } from 'rxjs'
import { JoinEvent, RichLogootSOperation, State } from 'mute-core'
import { LogootSAdd, LogootSDel, TextDelete, TextInsert }  from 'mute-structs'
import { DocService } from 'mute-core/lib'

import { Doc } from '../../core/Doc'
import { LocalStorageService } from '../../core/storage/local-storage/local-storage.service'
import { AUTHORS } from './mock-authors'
import { Author } from '../../core/Author'

@Injectable()
export class DocHistoryService {

  constructor (
    private localStorage: LocalStorageService
  ) {}

  getOperations (doc: Doc): Promise<(Delete|Insert)[]> {
    return new Promise((resolve, reject) => {
      this.localStorage.getBody(doc)
        .then((body: any) => {
          const logootSOp: (LogootSAdd | LogootSDel)[] = body.richLogootSOps
            .map((richLogootSOp: any): RichLogootSOperation | null => {
              return RichLogootSOperation.fromPlain(richLogootSOp)
            })
            .filter((richLogootSOp: RichLogootSOperation | null) => {
              return richLogootSOp instanceof RichLogootSOperation
            })
            .map((richLogootSOp: RichLogootSOperation) => richLogootSOp.logootSOp)
          const mcDocService = new DocService(42)
          mcDocService.onRemoteTextOperations
            .map((ops: (TextDelete | TextInsert)[]) => {
              return ops.map((op: Delete | Insert) => {
                const randAuthor = AUTHORS[Math.floor(Math.random() * AUTHORS.length)]
                op.authorId = randAuthor[0]
                op.authorName = randAuthor[1]
                return op
              })
            }).subscribe((ops) => resolve(ops))
          mcDocService.remoteLogootSOperationSource = Observable.from([logootSOp])
        })
        .catch((err) => {
          log.error('Error getting document body of: ', doc)
        })
    })
  }


  getAuthors (doc: Doc): Promise<Author[]> {
    return new Promise((resolve, reject) => {
      let docAuthors: Author[] = []
      this.getOperations(doc)
          .then((ops: (Delete | Insert)[]) => {
            for (let o of ops) {
              let author: Author = new Author(o.authorName, o.authorId, 'rgb(' + (Math.floor(Math.random() * 256)) +
                ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')')

              if (docAuthors.filter((e) => {
                return e.getId() === author.getId()
              }).length === 0) {
                docAuthors.push(author)
              }
            }
            resolve(docAuthors)
          })
    })
  }

}

export interface Delete extends TextDelete {
  authorId: number,
  authorName: string
}

export interface Insert extends TextInsert {
  authorId: number,
  authorName: string
}

