export enum OrderStatus {
    PENDING = 'PENDING',
    PREPARING = 'PREPARING',
    DELIVERING = 'DELIVERING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface StatusConfig {
    label: string;
    class: string;
    [key: string]: string;
}

export const ORDER_STATUS_CONFIG: Record<string, StatusConfig> = {
    [OrderStatus.PENDING]: {
        label: 'Aguardando',
        class: 'bg-primary/25 text-primary border-primary/30'
    },
    [OrderStatus.PREPARING]: {
        label: 'Preparando',
        class: 'bg-yellow-500/25 text-yellow-500 border-yellow-500/30'
    },
    [OrderStatus.DELIVERING]: {
        label: 'Saiu p/ Entrega',
        class: 'bg-blue-500/25 text-blue-500 border-blue-500/30'
    },
    [OrderStatus.COMPLETED]: {
        label: 'Concluído',
        class: 'bg-green/25 text-green border-green/30'
    },
    [OrderStatus.CANCELLED]: {
        label: 'Cancelado',
        class: 'bg-red-500/25 text-red-500 border-red-500/30'
    }
};

export function getOrderStatusConfig(status: string): StatusConfig {
    return ORDER_STATUS_CONFIG[status] || {
        label: status,
        class: 'bg-gray text-subtext border-gray'
    };
}