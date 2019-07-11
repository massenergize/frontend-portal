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
    constructor(props) {
        super(props);
        //options for the graphs, color, size....

    }
    render() {
        const options = {
            title: {
                text: this.props.title,
                style: {
                    fontSize: '28px',
                    fontFamily: "'Verdana', sans-serif",
                    color: '#263238'
                },
            },
            colors: this.props.colors,
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: this.props.categories
            }
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