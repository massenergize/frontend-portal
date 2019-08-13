import React from 'react';
import URLS from '../../../api/urls';
import { getJson } from '../../../api/functions'
import LoadingCircle from '../../Shared/LoadingCircle';
import PageTitle from '../../Shared/PageTitle';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {connect} from 'react-redux';

class PoliciesPage extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         loaded: false
    //     }
    // }
    // componentDidMount() {
    //     Promise.all([
    //         getJson(URLS.PAGE + "/2"),
	// 	]).then(myJsons => {
	// 		this.setState({
    //             policies: myJsons[0].data.sections,
	// 			loaded: true
	// 		})
	// 	}).catch(err => {
	// 		console.log(err)
	// 	});
    // }

    render() {
        if(!this.props.policies) return <LoadingCircle/>;
        return (
            <div className='boxed-wrapper'>
                <div className="container p-5">
                    <PageTitle>Policies</PageTitle>
                    <Accordion defaultActiveKey="0">
                        {this.renderPolicies(this.props.policies)}
                    </Accordion>
                </div>
            </div>
        );
    }

    renderPolicies(policies) {
        return Object.keys(policies).map((key) => {
            const policy = policies[key];
            return (
                <Card key={key}>
                    <Accordion.Toggle as={Card.Header} eventKey={key}>
                    {policy.name}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={key}>
                    <Card.Body dangerouslySetInnerHTML={{__html: policy.description}}></Card.Body>
                    </Accordion.Collapse>
                </Card>
            );
        });
    }
}

const mapStoreToProps = (store) => {
    return {
        policies: store.page.policies
    }
}
export default connect(mapStoreToProps, null)(PoliciesPage);