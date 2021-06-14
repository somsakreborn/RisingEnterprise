import {Injectable} from '@angular/core';
import {Channel} from './channels.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ChannelsService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private http: HttpClient) {

    }

    addChannel(channel: Channel) {
        return this.http.post('https://somsakreborn.com:8888/api/v1/channel', channel, {headers: this.headers});
    }

    fetchChannel() {
        return this.http.get<Channel[]>(`https://somsakreborn.com:8888/api/v1/channel`, {headers: this.headers});
    }

    fetchViewChannel(channel: Channel) {
        // const httpOptions = {params: new HttpParams({fromObject: {channelId: channel.channelId}), headers: this.headers};
        return this.http.get<Channel>(`https://somsakreborn.com:8888/api/v1/channel/${channel.channelId}`, {headers: this.headers});
    }

    updateChannel(channel: Channel) {
        return this.http.put(`https://somsakreborn.com:8888/api/v1/channel`, channel, {headers: this.headers});
    }

    deleteChannel(channel: Channel) {
        return this.http.delete(`https://somsakreborn.com:8888/api/v1/channel/${channel.channelId}`, {headers: this.headers});
    }

    uploadFile(data: FormData) {
        return this.http.post<any>(`https://somsakreborn.com:8888/api/v1/fileUploadChannel`, data);
    }

}
