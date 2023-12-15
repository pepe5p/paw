import { Pipe, PipeTransform } from '@angular/core';
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

@Pipe({
  name: 'formatTimestamp',
  standalone: true
})
export class FormatTimestampPipe implements PipeTransform {

  transform(timestamp: Timestamp): string {
    const dateTime = timestamp.toDate();
    const time = dateTime.toLocaleTimeString();
    const date = dateTime.toLocaleDateString();
    return `${date} ${time}`;
  }

}
