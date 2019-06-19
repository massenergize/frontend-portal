import React from 'react'
import CircleGraph from './CircleGraph'
class Graphs extends React.Component{

    renderGraphs(graphs){
        if(!graphs){
            return <div>No Graphs to Display</div>
        }
        var num = Object.keys(graphs).length;
        var tag;
        
        if(num == 3)
            tag = "col-md-4 col-sm-6 col-xs-12";
        else
            tag = "col-md-3 col-sm-6 col-xs-12";

        return Object.keys(graphs).map(key=> {
            var graph = graphs[key];
            return  <article className={"column "+tag} data-wow-duration="0ms">
                        <div className="item">
                            <CircleGraph num={graph.data} goal={graph.goal} label={graph.title} size={graph.size}/>
                        </div>
                    </article>
        });  
    }
    render(){
        if(Object.keys(this.props.graphs).length == 2){
            return(
                <section className="fact-counter style-2 no-padd">
                    <div className="container">
                        <div className="row clearfix">
                            <article className={"column col-md-3"}></article>
                            <div className="counter-outer clearfix">
                                {this.renderGraphs(this.props.graphs)}
                            </div>
                            <article className={"column col-md-3"}></article>
                            
                        </div>
                        
                    </div>
                    <button className="button" >More</button>
                </section> 
            );
        }
        return(
            <section className="fact-counter style-2 no-padd">
                <div className="container">
                    <div className="row clearfix">
                        <div className="counter-outer clearfix">
                            {this.renderGraphs(this.props.graphs)}
                        </div>
                    </div>
                    <button className="button">More</button>
                </div>
            </section>
        );
    }
}
export default Graphs;