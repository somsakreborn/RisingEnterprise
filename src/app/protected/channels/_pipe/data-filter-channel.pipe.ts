import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterChannel'
})

export class DataFilterChannelPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.channelName = m.channelName ? m.channelName : '';
                m.channelUrl = m.channelUrl ? m.channelUrl : '';
                m.channelComment = m.channelComment ? m.channelComment : '';
                m.channelCreated = m.channelCreated ? m.channelCreated : '';
                // m.channelPiece = m.channelPiece ? m.channelPiece : '';
                return m;
            }).filter(f => f.channelName.includes(query)
                || f.channelUrl.includes(query)
                || f.channelComment.includes(query)
                || f.channelCreated.includes(query)
                // || f.channelPiece.includes(query)
            );
        }
        return array;
    }

}
