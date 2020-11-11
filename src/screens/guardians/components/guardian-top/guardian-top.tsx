import React from 'react'
import { RouteParams } from '../../../../global/types';
import { GuardianInfo } from './components/guardian-info/guardian-info';
import { GuardianSearch } from './components/guardian-search/guardian-search'
import './guardian-top.scss';

interface StateProps {
    params: RouteParams;
}


export const GuardianTop = ({params}:StateProps ) =>  {
    return (
        <div className='guardian-top flex-start-center'>
                <GuardianSearch address = {params.address} section = {params.section}/>
                <GuardianInfo />
        </div>
    )
}

