import React from 'react'
import URLS, {getJson, section} from '../../api_v2';
import LoadingPage from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import {Link} from 'react-router-dom'

class StoriesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            userData: null,
        }
    }
    componentDidMount() {
        Promise.all([
            getJson(URLS.PAGES + "?name=Testimonials"),
            getJson(URLS.TESTIMONIALS),
        ]).then(myJsons => {
            this.setState({
                welcomeImagesData: myJsons[0].data[0].sections[0].slider[0].slides,
                stories: myJsons[1].data,
                loaded: true
            })
        }).catch(err => {
            console.log(err)
        });
    }

    render() {
        if(!this.state.loaded) return <LoadingPage/>;
        
        const {
            welcomeImagesData,
            stories,
        } = this.state.pageData;

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
                            <h4>{story.author}</h4>
                            <p>{story.location}</p>
                        </div>
                        {(story.actionId) ? <p><Link to={`/actions/${story.actionId}`} className="font-normal"><u>Linked Action</u></Link></p> : null}
                    </div>
                </div>
            );
        });
    }
}
export default StoriesPage;