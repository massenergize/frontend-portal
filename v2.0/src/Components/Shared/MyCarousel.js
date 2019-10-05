import React, { Component } from 'react'
import Carousel from 'react-bootstrap/Carousel'
class MyCarousel extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  ejectPictures = () => {
    const images = this.props.images;
    if (images.length === 0) return <div></div>;
    return (
      images.map((imageObj, index) => {
        return (<Carousel.Item key={index}>
          <img
            className=" car-img "
            src={imageObj.image.url}
            alt="Image Slide"
          />
        </Carousel.Item>
        )
      })
    )
  }
  render() {
    return (
      <div style={{ height: 400, position: 'relative' }}>
        <div style={{zIndex:10, height: 650, position: 'absolute', width: '100%' }}>
          <center>
            <h1 style={{ color: 'white',marginTop:'20%',fontSize:'4.5rem' }} className="cool-font"><span className="overlay-text-shadow">Wayland</span> <span className="overlay-text-shadow" style={{color:'burlywood'}}>Community</span></h1>
          </center>
        </div>
        <div className="my-overlay"></div>
        <Carousel >
          {this.ejectPictures()}
        </Carousel>
      </div>
    )
  }
}

export default MyCarousel
