import React from 'react'
import Chart from 'react-apexcharts'

/*
Circle graph is a graph that displays a progress bar in a circle
@props:
	size: of the graph
	num: completed actions or whatever you want to display
	goal: the number you are trying to get to
	label: the label in the middle of the circle
*/
class CircleGraph extends React.Component {
    constructor(props) {
        super(props);
        //options for the graphs, color, size....
        //could potentially move this to an api for graphs but probably don't need to
        this.state = {
            options: {
                chart: {
                    type: "radialBar",
                    // height: 010
                },
                series: [67],
                colors: this.props.colors,
                plotOptions: {
                    radialBar: {
                        size: this.props.size,
                        // hollow: {
                        //     margin: 5,
                        //     size: "60%",
                        // },
                        track: {
                            show: true,
                            width: '100px'
                        //     dropShadow: {
                        //         enabled: true,
                        //         top: 2,
                        //         left: 0,
                        //         blur: 4,
                        //         opacity: 0.15
                        //     }
                         },
                        dataLabels: {
                            name: {
                                offsetY: -3,
                                color: "#666",
                                fontSize: "13px",
                                fontFamily: "Verdana-bold"
                            },
                            value: {
                                offsetY: 3,
                                color: "#666",
                                fontSize: "18px",
                                fontFamily: "Verdana",
                                show: true,
                                formatter: () => {
                                    return this.props.num + "/" + this.props.goal;
                                }
                            }
                        }
                    }
                },
                // fill: {
                //     type: "gradient",
                //     gradient: {
                //         shade: "dark",
                //         type: "vertical",
                //         gradientToColors: ["#428a36"],
                //         stops: [0, 100]
                //     }
                // },
                stroke: {
                    lineCap: "round"
                },
                labels: [this.props.label]
            },
            series: [(this.props.num / this.props.goal) * 100],
        }
    }

    render() {

        return ( <
            Chart options = { this.state.options }
            series = { this.state.series }
            type = "radialBar"
            className="apex-chart circle-graph"/>
        );
    }
}
export default CircleGraph;