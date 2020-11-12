import React, { useRef } from 'react'
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { ChartData } from 'global/types';
import { generateDatasets, getLineChartBaseSettings } from 'utils/chart';

interface StateProps {
    chartData: ChartData;
}

export const Chart = ({ chartData }: StateProps) => {
    const ref = useRef<any>(null);
    const {t} = useTranslation()
    const data = {
        datasets: generateDatasets(chartData)
    };
    const options = getLineChartBaseSettings(chartData.unit, ref, t);
    return <Line data={data} options={options} ref={ref}/>;
};