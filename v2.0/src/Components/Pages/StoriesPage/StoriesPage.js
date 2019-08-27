import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import StoryForm from '../ActionsPage/StoryForm'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'

class StoriesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            limit: 140, //size of a tweet
            expanded: null
        }
    }
    render() {
        const {
            stories
        } = this.props;
        if (stories == null) return <LoadingCircle />;

        //const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;

        return (
            <>
                <BreadCrumbBar links={[{ name: 'Testimonials' }]} />
                <div className="boxed_wrapper">
                    <section className="testimonial2">
                        <div className="container">
                            <div className="row masonary-layout">
                                {this.renderStories(stories)}
                            </div>
                            <div className="col-12 ">
                                {this.props.user ?
                                    <StoryForm uid={this.props.user.id} />
                                    :
                                    <p className='text-center'><Link to='/login'>Sign in</Link> to submit a story</p>
                                }
                            </div>
                        </div>
                    </section>
                </div>
            </>
        );
    }

    renderStories(stories) {
        if (stories.length === 0) {
            return (
                <div className="col-12 text-center">
                    <p > There are not any testimonials yet.  If you have a story to tell, let us know in the form below</p>
                </div>
            )
        }
        return stories.map(story => {
            var cn = "col-md-4 col-sm-6 col-xs-12";
            if (this.state.expanded !== null) {
                if (this.state.expanded === story.id) {
                    cn = 'col-12'
                } else {
                    cn = 'd-none'
                }
            }
            console.log(cn)
            return (
                <div className={cn}>
                    <div className="item center">
                        <div className="quote">
                            <i className="fa fa-quote-left"></i>
                        </div>
                        <h4 className="title p-2">{story.title}</h4>
                        {this.state.expanded && this.state.expanded === story.id ?
                            <button className='as-link' style={{ width: '100%', margin: 'auto' }} onClick={() => { this.setState({ expanded: null }) }}>close</button> : null
                        }
                        <p className="p-1 text-center">
                            {this.state.expanded && this.state.expanded === story.id ? story.body : story.body.substring(0, this.state.limit)}
                            {(!this.state.expanded || !this.state.expanded === story.id) && this.state.limit < story.body.length ?
                                <button className='as-link' style={{ width: '100%', margin: 'auto' }} onClick={() => { this.setState({ expanded: story.id }) }}>...</button>
                                :
                                null
                            }
                        </p>
                        <div className="author">
                            <h4>{story.user.full_name}</h4>
                            {/* <p>{story.location}</p> */}
                        </div>
                        {(story.action) ? <p><Link to={`/actions/${story.action.id}`} className="font-normal"><u>{story.action.title}</u></Link></p> : null}
                    </div>
                </div>
            );
        });
    }
}
const mapStoreToProps = (store) => {
    return {
        stories: store.page.testimonials,
        user: store.user.info
    }
}
export default connect(mapStoreToProps, null)(StoriesPage);