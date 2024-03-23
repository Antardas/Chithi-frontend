import { format, getISOWeek, isSameDay, subDays } from 'date-fns';

class TimeAgo {
  transform(value: string) {
    const date = new Date(value) ?? value;

    return this.timeDifference(new Date(), new Date(date));
  }

  chatMessageTransform(value: string) {
    const date = new Date(value);

    const yesterday = subDays(new Date(), 1);

    if (isSameDay(date, new Date())) {
      return 'Today';
    } else if (isSameDay(date, yesterday)) {
      return 'Yesterday';
    } else if (getISOWeek(new Date()) === getISOWeek(date) || getISOWeek(new Date()) - getISOWeek(date) === 1) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'd MMMM YYYY');
    }
  }

  dayMonthYear(value: string) {
    const date = new Date(value);
    return format(date, 'd MMMM yyyy');
  }

  timeFormat(value: string) {
    const date = new Date(value);
    return format(date, 'HH:mm a');
  }

  timeDifference(current: Date, eventTime: Date) {
    const msPerMinute = 60 * 1000;
    const msPerHour = 60 * msPerMinute;
    const msPerDay = 24 * msPerHour;
    const msPerMonth = 30 * msPerDay;
    const elapsed = current.valueOf() - eventTime.valueOf();

    // Checking the same year or not
    if (format(current, 'yyyy') === format(eventTime, 'yyyy')) {
      if (elapsed < msPerMinute) {
        return this.secondAgo(elapsed);
      } else if (elapsed < msPerHour) {
        return this.minuteAgo(elapsed, msPerMinute);
      } else if (elapsed < msPerDay) {
        return this.hoursAgo(elapsed, msPerHour);
      } else if (elapsed < msPerMonth) {
        return this.daysAgo(elapsed, msPerDay);
      } else {
        return this.monthsAgo(eventTime, elapsed, msPerMonth);
      }
    } else {
      return format(eventTime, 'MMM d, yyyy');
    }
  }

  secondAgo(elapsed: number) {
    const sec = Math.round(elapsed / 1000);
    if (sec <= 1) {
      return 'a second ago';
    } else {
      return `${sec} second ago`;
    }
  }
  minuteAgo(elapsed: number, msPerMinute: number) {
    const minutes = Math.round(elapsed / msPerMinute);
    if (minutes <= 1) {
      return 'a minute ago';
    } else {
      return `${minutes} minutes ago`;
    }
  }

  hoursAgo(elapsed: number, msPerHour: number) {
    const hours = Math.round(elapsed / msPerHour);
    if (hours <= 1) {
      return 'an hour ago';
    } else {
      return `${hours} hours ago`;
    }
  }
  daysAgo(elapsed: number, msPerDay: number) {
    const days = Math.round(elapsed / msPerDay);
    if (days <= 1) {
      return 'a day ago';
    } else {
      return `${days} day ago`;
    }
  }
  monthsAgo(date: Date, elapsed: number, msPerDay: number) {
    const months = Math.round(elapsed / msPerDay);
    if (months <= 7) {
      return format(date, 'eeee');
    } else {
      return format(date, 'MMM d');
    }
  }
}

export const timeAgo: TimeAgo = new TimeAgo();
