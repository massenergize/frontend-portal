import React from 'react'

// Carousel from npm react-multi-carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

/**
 * 
 */
class TeamMembers extends React.Component {
    render() {
        const carouselResponsive = {
            desktop: {
              breakpoint: {max: 5000, min: 992},
              items: 4,
            },
            tablet: {
              breakpoint: { max: 992, min: 660 },
              items: 3,
            },
            mobile: {
              breakpoint: { max: 660, min: 0},
              items: 2,
            },
          };
        return (
            <section className="our-team pt-5">
                <div className="container-fluid">
                    <div className="section-title">
                        <h2>Meet Our Team</h2>
                    </div>
                    <Carousel
                        swipeable={true}
                        draggable={false}
                        showDots={false}
                        responsive={carouselResponsive}
                        ssr={true} // means to render carousel on server-side.
                        slidesToSlide={1}
                        infinite={true}
                        autoPlay={true}
                        autoPlaySpeed={4000}
                        transitionDuration={500}
                        containerClass="carousel-container"
                        removeArrowOnDeviceType={["mobile"]}
                        deviceType={this.props.deviceType}
                        itemClass="carousel-item-padding-40-px"
                        >
                        {this.renderCarouselElements(this.props.data)}
                    </Carousel>
                </div>
            </section>
        );
    }

    renderCarouselElements(teamMembers) {
        return teamMembers.map((member, key) => {
            console.log(member);
            return (
                <article className="col" key={key}>
                    <div className="single-team-member">
                        <figure className="img-box">
                            <img src={member.imageLink} alt="" className="width-100"/>
                        </figure>
                        <div className="author-info text-center">
                            <h4>{member.name}</h4>
                            <p>{member.role}</p>
                            <p className="font-normal font-italic ">{member.description}</p>
                            <hr/>
                        </div>
                            
                    </div>
                </article>
            )
        });
    }
}
export default TeamMembers;