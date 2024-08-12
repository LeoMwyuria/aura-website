import React from 'react';
import Button from '../Button/Button';

const Dashboards: React.FC = () => {
    return (
        <div className='mt-2 '>
            <span className='text-gray-500 font-semibold'>Leaderboards</span>
            <div>
                <div className='flex flex-col space-y-2 overflow-y-auto'>
                    <Button label="Daily" />
                    <Button label="Weekly" />
                    <Button label="Monthly" />
                    <Button label="Yearly" />
                </div>
            </div>
        </div>
    );
};

export default Dashboards;
