import React from 'react'
import { section } from '../../../api/functions'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';

class StoriesPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            pageData,
            stories
        } = this.props;
        if(pageData == null || stories == null) return <LoadingCircle/>;

        const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;

        return (
            <div className="boxed_wrapper">
                
                <WelcomeImages
                    data={welcomeImagesData} title="Testimonials"
                />
                <section className="testimonial2">
                    <div className="container">
                        <div className="row masonary-layout">
                            {this.renderStories(stories)}
                        </div>
                    </div>
                </section>
                
            </div>
        );
    }

    renderStories(stories) {
        return stories.map(story => {
            return (
                <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="item center">
                        <div className="quote">
                            <i className="fa fa-quote-left"></i>
                        </div>
                        <h4 className="title p-2">{story.title}</h4>
                        <p className="p-1">{story.body}</p>
                        <div className="author">
                            <h4>{story.user.full_name}</h4>
                            {/* <p>{story.location}</p> */}
                        </div>
                        {(story.action) ? <p><Link to={`/actions/${story.action.id}`} className="font-normal"><u>Linked Action</u></Link></p> : null}
                    </div>
                </div>
            );
        });
    }
}
const mapStoreToProps = (store) => {
    return {
        pageData: store.page.testimonialsPage,
        stories: store.page.testimonials
    }
}
export default connect(mapStoreToProps, null)(StoriesPage);