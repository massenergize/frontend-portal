import React from 'react'

/** Renders an image banner that has one, two or three images across it based on screen size
 */
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
        //works best with tall images from online, my images are too big(2-5mb) so they slow it down but these are good
        var picture1 = this.props.data[0].image.file;
        var picture2 = this.props.data[1].image.file;
        var picture3 = this.props.data[2].image.file;

        var bannerstyle; //checks the width and changes how many images are displayed based on that
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