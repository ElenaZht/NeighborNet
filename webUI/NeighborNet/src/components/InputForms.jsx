import React, { useState } from 'react';
import { FaExclamationTriangle, FaGift, FaHandsHelping, FaQuestionCircle } from 'react-icons/fa';
import IssueReportInputForm from './reports/issueReportInputForm';
import GiveAwayInputForm from './reports/giveAwayInputForm';
import OfferHelpInputForm from './reports/offerHelpInputForm';
import HelpRequestInputForm from './reports/helpRequestInputForm';

export default function InputForms() {
  const [activeTab, setActiveTab] = useState('issue');

  const tabs = [
    {
      id: 'issue',
      label: 'Report Issue',
      icon: <FaExclamationTriangle className="w-4 h-4" />,
      component: <IssueReportInputForm />,
      description: 'Report community issues'
    },
    {
      id: 'giveaway',
      label: 'Give Away',
      icon: <FaGift className="w-4 h-4" />,
      component: <GiveAwayInputForm />,
      description: 'Share items with neighbors'
    },
    {
      id: 'offer',
      label: 'Offer Help',
      icon: <FaHandsHelping className="w-4 h-4" />,
      component: <OfferHelpInputForm />,
      description: 'Offer your skills & services'
    },
    {
      id: 'request',
      label: 'Request Help',
      icon: <FaQuestionCircle className="w-4 h-4" />,
      component: <HelpRequestInputForm />,
      description: 'Ask neighbors for help'
    }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Tab Navigation */}
      <div className="bg-base-100 rounded-t-lg">
        <div className="flex border-b border-base-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tab Description */}
        <div className="px-6 py-3 bg-base-50 border-b border-base-300">
          <div className="flex items-center gap-2">
            {activeTabData.icon}
            <h2 className="text-lg font-semibold text-gray-800">
              {activeTabData.label}
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {activeTabData.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-base-100 rounded-b-lg">
        <div className="transition-all duration-300 ease-in-out">
          {activeTabData.component}
        </div>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="sm:hidden mt-4 flex justify-center">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                activeTab === tab.id ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}