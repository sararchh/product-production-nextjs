import React from 'react';
import { Text } from '../atoms';

export interface DashboardCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  borderColor: string;
  iconBgColor: string;
  actionText: string;
  actionTextColor?: string;
  onClick?: () => void;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  icon,
  borderColor,
  iconBgColor,
  actionText,
  actionTextColor = 'text-blue-700 hover:text-blue-600',
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 ${borderColor} ${className}`}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt>
                <Text variant="body" color="secondary" className="truncate">
                  {title}
                </Text>
              </dt>
              <dd>
                <Text variant="h5" weight="semibold">
                  {subtitle}
                </Text>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Text weight="medium" className={actionTextColor}>
            {actionText}
          </Text>
        </div>
      </div>
    </div>
  );
};
