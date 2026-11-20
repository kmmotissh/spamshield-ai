import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function RiskBadge({ level }) {
  const normLevel = (level || 'LOW').toUpperCase();

  switch (normLevel) {
    case 'CRITICAL':
      return (
        <span className="badge badge-critical">
          <AlertOctagon size={13} />
          CRITICAL THREAT
        </span>
      );
    case 'HIGH':
      return (
        <span className="badge badge-high">
          <ShieldAlert size={13} />
          HIGH RISK
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="badge badge-medium">
          <AlertTriangle size={13} />
          MODERATE RISK
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="badge badge-safe">
          <ShieldCheck size={13} />
          LIKELY SAFE
        </span>
      );
  }
}
