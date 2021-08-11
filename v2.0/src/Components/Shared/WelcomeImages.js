import React from 'react'
import Carousel from 'react-bootstrap/Carousel'

/** Renders an arbititary amount of images beside eachother, until the window is skinny enough
 * at which point renders a carousel that cycles all of the images
 */
class WelcomeImages extends React.Component {

    constructor(props) {
        super(props);
        this.imageURLs = this.props.data.map(data => data.url);
        this.numImages = this.imageURLs.length;
        this.carouselWidthPercent = '70%';
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    handleResize () {
        this.forceUpdate();
    };

    render() {

        let imageStyle = {
            height: '100%',
            width: '100%',
            objectFit: "cover"
        }

        if (window.innerWidth > 700) {

            let divStyle = {
                width: '100%',
                height: (window.innerWidth / (4 * this.numImages)) * 3 + 'px',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '1fr '.repeat(this.numImages),
                gridTemplateRows: '1fr'
            }

            return (
                <div className="inner-banner text-center" style={divStyle}>
                    {this.imageURLs.map(image =>
                        <img src={image} alt="Welcome" key={image} style={imageStyle} />)
                    }
                </div>
            );

        } else {

            let divStyle = {
                width: this.carouselWidthPercent,
                display: 'block',
                margin: 'auto',
                height: ((window.innerWidth / 4) * 3) *
                    (parseFloat(this.carouselWidthPercent) / 100) + 'px'
            };

            return (
                <div className="inner-banner text-center">

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