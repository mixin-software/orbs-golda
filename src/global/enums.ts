export enum DelegatorsSections {
    STAKE = 'STAKE',
    REWARDS = 'REWARDS',
    ACTIONS = 'ACTIONS'
}

export enum GuardiansSections {
    STAKE = 'STAKE',
    REWARDS = 'REWARDS',
    DELEGATORS = 'DELEGATORS',
    ACTIONS = 'ACTIONS'
}

export enum OverviewSections {
    STAKE = 'STAKE',
    WEIGHTS = 'WEIGHTS'
}

export enum LoaderType {
    TEXT = 'TEXT',
    BIG = 'BIG',
    LIST = 'LIST',
    ONE_LINE = 'ONE_LINE'
}

export enum DelegatorActionsTypes {
    STAKED = 'Staked',
    RESTAKED = 'Restaked',
    WITHDREW = 'Withdrew',
    DELEGATED = 'Delegated',
    UNSTAKED = 'Unstaked',
    CLAIMED = 'DelegatorStakingRewardsClaimed'
}

export enum GuardianActionsTypes {
    STAKED = 'Staked',
    RESTAKED = 'Restaked',
    UNSTAKED = 'Unstaked',
    WITHDREW = 'Withdrew',
    CLAIM_GUARDIAN_REWARDS = 'GuardianStakingRewardsClaimed',
    DELEGATOR_STAKING_REWARDS_CLAIMED = 'DelegatorStakingRewardsClaimed',
    BOOTSTRAP_REWARDS_WITHDREW = 'BootstrapRewardsWithdrawn',
    FEES_WITHDRAWN = 'FeesWithdrawn',
    DELEGATED_TO = 'Delegated',
    GUARDIAN_REGISTERED = 'GuardianRegistered',
    SELF_DELEGATED = 'SelfDelegated'
}

export enum TimeRangeSelectorOptions {
    DAYS = 'DAYS',
    WEEKS = 'WEEKS',
    MONTHS = 'MONTHS'
}

export enum SearchListType {
    GUARDIAN = 'GUARDIAN',
    DELEGATOR = 'DELEGATOR'
}

export enum ChartUnit {
    DAY = 'day',
    MONTH = 'month',
    WEEK = 'week'
}

export enum ChartColors {
    TOTAL_STAKE = 'orange',
    SELF_STAKE = '#CF4E81',
    DELEGATORS = '#74DABF'
}

export enum ChartYaxis {
    Y1 = 'y1',
    Y2 = 'y2'
}
export enum ListItemType {
    STRING = 'string',
    AMOUNT = 'amount',
    DATE = 'date',
    LINK = 'link'
}

export enum OverviewChartType {
    STAKE = 'STAKE',
    WEIGHTS = 'WEIGHTS'
}

export enum GuardianChartName {
    SELF_STAKE = 'SELF_STAKE',
    DELEGATED_STAKE = 'DELEGATED_STAKE',
    DELEGATORS = 'DELEGATORS'
}
