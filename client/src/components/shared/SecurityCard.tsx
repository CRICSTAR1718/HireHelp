import React from 'react';
import { Shield, Lock, FileText, Key } from 'lucide-react';

export const SecurityCard: React.FC = () => {
  const securityFeatures = [
    { icon: Shield, title: 'Enterprise-grade Security', description: 'Bank-level encryption' },
    { icon: Lock, title: 'Role-based Access', description: 'Controlled permissions' },
    { icon: FileText, title: 'Audit Logs', description: 'Complete activity tracking' },
    { icon: Key, title: 'Secure Authentication', description: 'Multi-factor support' },
  ];

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 p-4 border border-slate-200">
      <h3 className="mb-3 text-sm font-semibold text-slate-900 flex items-center">
        <Shield className="mr-2 h-4 w-4 text-blue-600" aria-hidden="true" />
        Enterprise-grade Security
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-start space-x-2">
            <feature.icon className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-slate-800">{feature.title}</p>
              <p className="text-[10px] text-slate-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
