import React, { useState } from 'react';
import Button from '../Button/Button';

const Dashboards: React.FC = () => {
    const [activeButton, setActiveButton] = useState<string>('Daily');

    const handleButtonClick = (label: string) => {
        setActiveButton(label);
    };

    return (
        <div className='mt-2 '>
            <span className='text-gray-500 font-semibold'>Leaderboards</span>
            <div>
                <div className='flex flex-col space-y-2 overflow-y-auto'>
                    <Button
                        label="Daily"
                        onClick={() => handleButtonClick('Daily')}
                        active={activeButton === 'Daily'}
                    />
                    <Button
                        label="Weekly"
                        onClick={() => handleButtonClick('Weekly')}
                        active={activeButton === 'Weekly'}
                    />
                    <Button
                        label="Monthly"
                        onClick={() => handleButtonClick('Monthly')}
                        active={activeButton === 'Monthly'}
                    />
                    <Button
                        label="Yearly"
                        onClick={() => handleButtonClick('Yearly')}
                        active={activeButton === 'Yearly'}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboards;
