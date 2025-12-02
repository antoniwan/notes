/**
 * Client-side utility function to format relative read time
 * Returns user-friendly relative time strings like "You read this yesterday"
 * This is a client-side version that can be imported in browser scripts
 */
export function formatRelativeReadTime(dateString: string): string {
  const now = new Date();
  const readDate = new Date(dateString);
  const diffInMs = now.getTime() - readDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    if (diffInDays === 1) {
      return 'You read this yesterday';
    } else if (diffInDays < 7) {
      return `You read this ${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? 'You read this a week ago' : `You read this ${weeks} weeks ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? 'You read this a month ago' : `You read this ${months} months ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? 'You read this a year ago' : `You read this ${years} years ago`;
    }
  } else if (diffInHours > 0) {
    return diffInHours === 1
      ? 'You read this an hour ago'
      : `You read this ${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1
      ? 'You read this a minute ago'
      : `You read this ${diffInMinutes} minutes ago`;
  } else {
    return 'You read this just now';
  }
}

/**
 * Alternative format for Guided Path (shorter format)
 * Returns strings like "Read a day ago" instead of "You read this a day ago"
 */
export function formatRelativeReadTimeShort(dateString: string): string {
  const now = new Date();
  const readDate = new Date(dateString);
  const diffInMs = now.getTime() - readDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    if (diffInDays === 1) {
      return 'Read a day ago';
    } else if (diffInDays < 7) {
      return `Read ${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? 'Read a week ago' : `Read ${weeks} weeks ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? 'Read a month ago' : `Read ${months} months ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? 'Read a year ago' : `Read ${years} years ago`;
    }
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? 'Read an hour ago' : `Read ${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1 ? 'Read a minute ago' : `Read ${diffInMinutes} minutes ago`;
  } else {
    return 'Read just now';
  }
}

