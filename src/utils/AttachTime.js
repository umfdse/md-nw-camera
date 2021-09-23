import Moment from 'moment';
export function MathTime (start, end) {
  var range = Moment(start).diff(Moment(end), 'seconds');
  if (range < 0) {
    return '<1m';
  }
  if (range > 0 && range < 60) {
    return '<1m';
  }
  if (range < 3600) {
    return Math.floor(range / 60) + 'm';
  }
  if (range >= 3600 && range < 86400) {
    var hours = Math.floor(range / 3600);
    if ((range - hours * 3600) < 60) {
      return hours + 'h';
    } else {
      return hours + 'h:' + Math.floor((range - hours * 3600) / 60) + 'm';
    }
  }
  var dates = Math.floor(range / 86400);
  if ((range - dates * 3600 * 24) < 60) {
    return dates + 'd';
  }
  if ((range - dates * 3600 * 24) > 60 && (range - dates * 3600 * 24) < 3600) {
    return dates + 'd:' + Math.floor((range - dates * 3600 * 24) / 60) + 'm';
  } else {
    var dif = range - dates * 3600 * 24;
    var diffHours = Math.floor(dif / 3600);
    if ((dif - diffHours * 3600) < 60) {
      return dates + 'd:' + diffHours + 'h';
    } else {
      return dates + 'd:' + diffHours + 'h:' + Math.floor((dif - diffHours * 3600) / 60) + 'm';
    }
  }
}
