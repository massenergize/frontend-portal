import React from 'react'
import CircleGraph from './CircleGraph'

/*
@props:
    graphs
        data(num)
        goal
        title(label)
        size
*/

//TODO need to make a link to the graphs page: maybe have three circle graphs and then icon that just takes them to the page
class Graphs extends React.Component{


    renderGraphs(graphs){
        if(!graphs){
            return <div>No Graphs to Display</div>
        }

        return Object.keys(graphs).map(key=> {
            var graph = graphs[key];
            return  <article className="column col-md-3 col-sm-6 col-xs-12" data-wow-duration="0ms">
                        <div className="item">
                            <CircleGraph num={graph.data} goal={graph.goal} label={graph.title} size={graph.size}/>
                        </div>
                    </article>
        });  
    }
    
    render(){
        var dumbycol ="";
        console.log(this.props.graphs);
        if(this.props.graphs && Object.keys(this.props.graphs).length === 2){
            dumbycol = <article className={"column col-md-3"}></article>;
        }
        return(
            <section className="fact-counter style-2 no-padd">
                <div className="container">
                    <div className="row no-gutter clearfix">
                        <div className="counter-outer clearfix">
                            {this.dumbycol}
                            {this.renderGraphs(this.props.graphs)}
                            <article className="column counter-column col-md-3 col-sm-6 col-xs-12 wow fadeIn" data-wow-duration="0ms">
                                <div className="item">
                                    <div className="icon"><i className="fa fa-chart-bar"/></div>
                                    <a href="/" className="thm-btn">More</a>
                                    <h4 className="counter-title">See more about our impact in the Community</h4>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
export default Graphs;