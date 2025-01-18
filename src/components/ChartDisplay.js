import React from 'react';
import ReactECharts from 'echarts-for-react';

const ChartDisplay = ({ data, chartType, colorPalette = ['#ff4d4f', '#ff7875', '#ff9c9c', '#ffbfbf', '#ffe2e2'] }) => {
    console.log('ChartDisplay received:', { data, chartType, colorPalette });

    const getOption = () => {
        if (!data) return {};

        const baseOption = {
            title: {
                text: 'Data Visualization',
                left: 'center'
            },
            tooltip: {
                trigger: chartType === 'pie' ? 'item' : 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    dataZoom: {},
                    dataView: {},
                    restore: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            color: colorPalette,
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicInOut'
        };

        // If the data has xAxis, yAxis, and series from API
        if (data.xAxis && data.yAxis && data.series) {
            const xAxisData = data.xAxis.data || [];
            const seriesData = data.series[0]?.data || [];

            if (chartType === 'pie') {
                // Transform to pie chart format
                return {
                    ...baseOption,
                    series: [{
                        name: 'Distribution',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: true,
                            formatter: '{b}: {c} ({d}%)'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '18',
                                fontWeight: 'bold'
                            }
                        },
                        data: xAxisData.map((name, index) => ({
                            name,
                            value: seriesData[index]
                        }))
                    }]
                };
            } else {
                // Bar or Line chart
                return {
                    ...baseOption,
                    xAxis: {
                        type: 'category',
                        data: xAxisData,
                        axisLabel: {
                            rotate: 45,
                            interval: 0
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        type: chartType,
                        data: seriesData,
                        smooth: chartType === 'line',
                        areaStyle: chartType === 'line' ? { opacity: 0.3 } : undefined,
                        itemStyle: chartType === 'bar' ? {
                            borderRadius: [4, 4, 0, 0]
                        } : undefined,
                        label: {
                            show: true,
                            position: 'top',
                            formatter: (params) => params.value.toLocaleString()
                        }
                    }]
                };
            }
        }

        // Handle legacy formats (if needed)
        if (data.dates && data.sales) {
            return {
                ...baseOption,
                xAxis: {
                    type: 'category',
                    data: data.dates,
                    axisLabel: {
                        rotate: 45
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: chartType,
                    data: data.sales,
                    smooth: chartType === 'line',
                    areaStyle: chartType === 'line' ? { opacity: 0.3 } : undefined,
                    itemStyle: chartType === 'bar' ? {
                        borderRadius: [4, 4, 0, 0]
                    } : undefined,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: (params) => params.value.toLocaleString()
                    }
                }]
            };
        }

        if (data.product && data.sales) {
            return {
                ...baseOption,
                xAxis: {
                    type: 'category',
                    data: data.product,
                    axisLabel: {
                        rotate: 45,
                        interval: 0
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: chartType,
                    data: data.sales,
                    smooth: chartType === 'line',
                    areaStyle: chartType === 'line' ? { opacity: 0.3 } : undefined,
                    itemStyle: chartType === 'bar' ? {
                        borderRadius: [4, 4, 0, 0]
                    } : undefined,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: (params) => params.value.toLocaleString()
                    }
                }]
            };
        }

        return {};
    };

    const option = getOption();
    console.log('Generated chart option:', option);

    return (
        <div style={{ 
            width: '100%', 
            height: '400px',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
            <ReactECharts
                option={option}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
                notMerge={true}
                lazyUpdate={true}
            />
        </div>
    );
};

export default ChartDisplay; 