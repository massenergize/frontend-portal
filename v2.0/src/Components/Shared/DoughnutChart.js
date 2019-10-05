import React, { Component } from 'react'
import { Doughnut } from 'react-chartjs-2';
class DoughnutChart extends Component {
  generateRandomColor = () => {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }
  ejectGraphs = () => {
    const colors = ["#f3c520","#33ccef"];
    const graphs = this.props.graphs;
    if (graphs.length === 0) return <div></div>
    //remove this before it goes live
    const newG = graphs.splice(0, 2);
    return newG.map((g,index) => {
      const data = {
        labels:[g.name],
        datasets: [{
          label:[g.name],
          backgroundColor: [colors[index]],
          data: [g.value]
        }]
      }
      return (
        <div className="col-md-6 col-lg-6">
          <center><h5 className="cool-font">{g.name}</h5></center>
          <Doughnut
            data={data}
            options={{
              rotation: 1 * Math.PI,
              circumference: 1 * Math.PI
            }}
          />
        </div>

      )
    })
  }
  render() {

    // const data = {
    //   labels: ['June', 'July'],
    //   datasets: [{
    //     label: 'My First dataset',
    //     backgroundColor: [this.generateRandomColor(), this.generateRandomColor()],
    //     data: [30, 45]
    //   }]

    // };
    return (
      <div>
        <div style={{ padding: 17, marginBottom: 20 }}>
          <div className="col-md-10 col-sm-10 col-lg-10 col-xs-12 offset-md-1">
            <center><h1 style={{ margin: 35 }} className="cool-font">Energy<span style={{ color: "green" }}>Charts</span></h1></center>
            <div className="row">
              {this.ejectGraphs()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DoughnutChart
