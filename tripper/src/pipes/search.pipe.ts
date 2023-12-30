import { Pipe, PipeTransform } from '@angular/core';
import {TripWithCumulatedReservations} from "../models/trip.model";

@Pipe({
  standalone: true,
  name: 'searchPipe',
})
export class SearchPipe implements PipeTransform {
  transform(courses: TripWithCumulatedReservations[], searchText: string): TripWithCumulatedReservations[] {
    if (!courses)
      return [];
    if (!searchText)
      return courses;
    searchText = searchText.toLowerCase();
    return courses.filter(course => {
      return course.name.toLowerCase().includes(searchText);
    });
  }
}
