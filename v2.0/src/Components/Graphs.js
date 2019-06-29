import React from 'react'
import CircleGraph from './CircleGraph'

/** Renders the graphs on the home page and a link to the impact page
 * @props :
    graphs
        data(num)
        goal
        title(label)
        size
*/


class Graphs extends React.Component{

    renderGraphs(graphs){
        if(!graphs){
            return <div>No Graphs to Display</div>
        }
        return Object.keys(graphs).map(key=> {
            var graph = graphs[key];
<<<<<<< Updated upstream
            return  <div className="column col-md-3 col-sm-6 col-xs-12" data-wow-duration="0ms">
                        <CircleGraph num={graph.data} goal={graph.goal} label={graph.title} size={graph.size}/>
                    </div>
=======
            return  <article className="column col-md-3 col-sm-6 col-xs-12">
                        <div className="item">
                            <CircleGraph num={graph.data} goal={graph.goal} label={graph.title} size={graph.size}/>
                        </div>
                    </article>
>>>>>>> Stashed changes
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
            </section>
        );
    }
}
export default Graphs;