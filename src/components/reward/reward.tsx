import React from 'react';
import { LoaderType } from '../../global/enums';
import { convertToString } from '../../utils/number';
import { LoadingComponent } from '../loading-component/loading-component';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import './reward.scss';

interface RewardProps {
    current?: number;
    claimed?: number;
    img: string;
    title: string;
    token: string;
    total?: number;
    isLoading: boolean;
}

export const Reward = ({ title, current, claimed, img, token, total, isLoading }: RewardProps) => {
    return (
        <TableRow className='reward'>
            <TableCell component="th" scope="row">
                <LoadingComponent loaderType={LoaderType.TEXT} isLoading={isLoading}>
                   <div className='flex-start-center'>
                   <img src={img} alt="" className="reward-image" />
                    <p className='reward-text reward-name one-line'>{title}</p>
                   </div>
                </LoadingComponent>
            </TableCell>
            <TableCell align="left">
                <LoadingComponent loaderType={LoaderType.TEXT} isLoading={isLoading}>
                 <div className="flex-start-center">
                 <p className='reward-text'>{convertToString(current)}</p>
                    <img src={token} alt="" className="reward-token" />
                 </div>
                </LoadingComponent>
            </TableCell>
            <TableCell align="left">
                <LoadingComponent loaderType={LoaderType.TEXT} isLoading={isLoading}>
                 <div className="flex-start-center">
                 <p className='reward-text'>{convertToString(claimed)}</p>
                    <img src={token} alt="" className="reward-token" />
                 </div>
                </LoadingComponent>
            </TableCell>
            <TableCell align="left">
                <LoadingComponent loaderType={LoaderType.TEXT} isLoading={isLoading}>
                <div className="flex-start-center">
                <p className='reward-text reward-total'>{convertToString(total)}</p>
                    <img src={token} alt="" className="reward-token" />
                </div>
                </LoadingComponent>
            </TableCell>
        </TableRow>
    );
};
