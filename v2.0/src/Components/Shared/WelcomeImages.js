import React from 'react'
import Carousel from 'react-bootstrap/Carousel'

/** Renders an arbititary amount of images beside eachother, until the window is skinny enough
 * at which point renders a carousel that cycles all of the images
 */
class WelcomeImages extends React.Component {

    constructor(props) {
      super(props);
      this.imageURLs = this.props.data.map(data => data.url);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    handleResize = () => {
        this.forceUpdate();
    };

    render() {
      
        var imageStyle = {
          height: '100%',
          width: '100%',
          objectFit: "cover"
        }

        if (window.innerWidth > 700) {

            var bannerStyle = {
              width: '100%',
              height: (window.innerWidth/(4 * this.imageURLs.length)) * 3 + 'px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr '.repeat(this.imageURLs.length),
              gridTemplateRows: '1fr'
            }

            return (
                <div className="inner-banner text-center" style={bannerStyle}>
                    {this.imageURLs.map(image =>
                        <img src={image} alt="" style={imageStyle} />)
                    }
                </div>
            );

        } else {

            let divStyle = {
							width: '100%',
							display: 'block',
							height: (window.innerWidth / 4) * 3 + 'px'
            };

            return (
                <div className="inner-banner text-center" >

                    <Carousel
                        interval={3000}
                        fade
                        indicators={false}
                        controls={false}
                        pauseOnHover={false}
                    >
                        {this.imageURLs.map(image => (
                            <Carousel.Item>
                                <div style={divStyle}>
                                    <img src={image} alt="" style={imageStyle} />
                                </div>
                            </Carousel.Item>))
                        }
                    </Carousel>
                </div>

            );
        }
    }
}

export default WelcomeImages;