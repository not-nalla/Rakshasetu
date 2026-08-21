export function severityColor(severity) {
  switch (severity) {
    case 'critical':
      return 'bg-red-500';
    case 'warning':
      return 'bg-amber-500';
    case 'info':
      return 'bg-blue-500';
    default:
      return 'bg-slate-400';
  }
}

export function severityTextColor(severity) {
  switch (severity) {
    case 'critical':
      return 'text-red-500';
    case 'warning':
      return 'text-amber-500';
    case 'info':
      return 'text-blue-500';
    default:
      return 'text-slate-400';
  }
}

export function severityBgLight(severity) {
  switch (severity) {
    case 'critical':
      return 'bg-red-50';
    case 'warning':
      return 'bg-amber-50';
    case 'info':
      return 'bg-blue-50';
    default:
      return 'bg-slate-50';
  }
}

export function statusColor(status) {
  switch (status) {
    case 'Available':
      return 'bg-emerald-100 text-emerald-700';
    case 'Filling':
      return 'bg-amber-100 text-amber-700';
    case 'Nearly Full':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}
