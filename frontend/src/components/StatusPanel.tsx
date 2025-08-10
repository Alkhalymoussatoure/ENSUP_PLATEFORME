import React from 'react';
import { CreditCard, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { useMessagesNonLus } from '../hooks/useMessagesNonLus'; 


interface StatusPanelProps {
  onNavigateToMessages?: () => void;
  onServiceClick?: (serviceName: string) => void;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ onNavigateToMessages, onServiceClick }) => {
  const { nombreNonLus, loading } = useMessagesNonLus();
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          Maintenant ?
        </h3>
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={() => onServiceClick && onServiceClick('solde-payer')}
          className="w-full rounded-lg p-4 bg-red-50 border-l-4 border-red-500 hover:bg-red-100 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500 rounded-lg text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium text-gray-800">Solde à payer</span>
                <div className="text-sm text-red-600">Urgent - Échéance proche</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-red-600">850,000</span>
              <div className="text-sm text-gray-600">GNF</div>
            </div>
          </div>
        </button>
        
        <button 
          onClick={onNavigateToMessages}
          className="w-full rounded-lg p-4 bg-emerald-50 border-l-4 border-emerald-500 hover:bg-emerald-100 transition-colors duration-200"
        >
           <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500 rounded-lg text-white relative">
                <MessageSquare className="h-5 w-5" />
                {nombreNonLus > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <div>
                <span className="font-medium text-gray-800">Messages</span>
                <div className="text-sm text-emerald-600">Nouveaux messages</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-emerald-600">
                {loading ? '...' : nombreNonLus}
              </span>
              <div className="text-sm text-gray-600">nouveaux</div>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => onServiceClick && onServiceClick('documents-diffuses')}
          className="w-full rounded-lg p-4 bg-emerald-50 border-l-4 border-emerald-500 hover:bg-emerald-100 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500 rounded-lg text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium text-gray-800">Documents diffusés</span>
                <div className="text-sm text-emerald-600">Récemment ajoutés</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-emerald-600">12</span>
              <div className="text-sm text-gray-600">documents</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default StatusPanel;