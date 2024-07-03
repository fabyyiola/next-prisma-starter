import React from 'react';
import * as HIcons from '@heroicons/react/24/outline';
interface Props{
    icon:string
}
const DynamicHeroIcon = ({ icon }:Props) => {
  const { ...icons } = HIcons;
  // @ts-ignore
  const TheIcon = icons[icon];

  return TheIcon ? (
    // @ts-ignore
    <TheIcon className="h-6 w-6" aria-hidden="true" />
  ) : null;
};

export default DynamicHeroIcon;
