import React from 'react'
import { section } from '../../../api/functions'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import StoryForm from '../ActionsPage/StoryForm'

class StoriesPage extends React.Component {
    render() {
        const {
            pageData,
            stories
        } = this.props;
        if(pageData == null || stories == null) return <LoadingCircle/>;

        //const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;

        return (
            <div className="boxed_wrapper">
                <section className="testimonial2">
                    <div className="container">
                        <div className="row masonary-layout">
                            {this.renderStories(stories)}
                        </div>
                        <div className="col-12 ">
                            {this.props.user?
                            <StoryForm uid={this.props.user.id}/>
                            :
                            <p className='text-center'><Link to='/login'>Sign in</Link> to submit a story</p>
                            }
                        </div>
                    </div>
                </section>
                
            </div>
        );
    }

    renderStories(stories) {
        if(stories.length === 0){
            return (
                <div className="col-12 text-center">
                    <p > There are not any testimonials yet.  If you have a story to tell, let us know in the form below</p>
                </div>
            ) 
        }
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
        stories: store.page.testimonials,
        user: store.user.info
    }
}
export default connect(mapStoreToProps, null)(StoriesPage);