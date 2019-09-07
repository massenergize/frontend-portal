import React from 'react'
import Chart from 'react-apexcharts'

/*
Bar graph
@props:
    title: title of the graph
	categories: list of x axis categories
    series: 
        data:list of y values for the categories: needs to be same size as the categories
        name: label for the series
*/
class BarGraph extends React.Component {

    render() {
        const options = {
            // title: {
            //     text: this.props.title,
            //     style: {
            //         fontSize: '28px',
            //         fontFamily: "'Verdana', sans-serif",
            //         color: '#263238'
            //     },
            // },
            // colors: this.props.colors,
            // stacked:this.props.stacked? this.props.stacked : false,
            // chart: {
            //     id: "basic-bar"
            // },
            // xaxis: {
            //     categories: this.props.categories
            // }
            title: {
                    text: this.props.title,
                    style: {
                        fontSize: '28px',
                        fontFamily: "'Verdana', sans-serif",
                        color: '#263238'
                    },
                },
            chart: {
                height: 350,
                type: 'bar',
                stacked: this.props.stacked? this.props.stacked : false,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            xaxis: {
                categories: this.props.categories
            },
            colors: this.props.colors,
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            series: this.props.series
        }
        return (
            <Chart style={{ margin: 'auto' }}
                options={options}
                series={this.props.series}
                type="bar"
            // width="80%"
            />
        );
    }
}
export default BarGraph;