import React from 'react'

class WelcomeImages extends React.Component{
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize);
    }
    handleResize = () => {
        this.forceUpdate();
    };
    
    render(){
        //works best with tall images from online, my images are too phat so they slow it down but these are good
        var picture1 = 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60';
        var picture2 = 'https://images.unsplash.com/photo-1420593248178-d88870618ca0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80';
        var picture3 = 'https://images.unsplash.com/photo-1496769336828-c522a3a7e33c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60';

        var bannerstyle;
        if(window.innerWidth > 1100){
            bannerstyle = {
                backgroundImage:`url(${picture1}), url(${picture2}), url(${picture3})`,
                backgroundSize:"33.333333%",
                backgroundPosition:"left top, center top, right top"
            }
        }else if (window.innerWidth >750){
            bannerstyle = {
                backgroundImage:`url(${picture1}), url(${picture2})`,
                backgroundSize:"50%",
                backgroundPosition:"left top, right top"
            }
        }else{
            bannerstyle = {
                backgroundImage:`url(${picture1})`,
                backgroundSize:"cover",
                backgroundPosition:"left top"
            }
        }
        //TODO make this only one or only two images depending on screen size.
        return(
            <div className="inner-banner text-center" style={bannerstyle}> 
                <div className="container">
                    <div className="box">
                        <h1>{this.props.title}</h1>
                     </div>
                </div>
            </div>
        );
    }
}
export default WelcomeImages;