import React from 'react'
class Footer extends React.Component{
    render(){
        return (
            <div>
                <footer class="main-footer">
                    {/* <!--Widgets Section--> */}
                    <div class="widgets-section">
                        <div class="container">
                            <div class="row">
                                {/* <!--Big Column--> */}
                                <div class="big-column col-md-6 col-sm-12 col-xs-12">
                                    <div class="row clearfix">
                                        {/* <!--Footer Column--> */}
                                        <div class="col-md-6 col-sm-6 col-xs-12">

                                            <div class="footer-widget about-column">
                                                <figure class="footer-logo"><a href="index.html"><img src="images/logo/logo2.png" alt=""/></a></figure>

                                                <div class="text"><p>When you give to us you know your donation is making a diffe. </p> </div>
                                                <ul class="contact-info">
                                                    <li><span class="icon-signs"></span>22/121 Apple Street, New York, <br/>NY 10012, USA</li>
                                                    <li><span class="icon-phone-call"></span> Phone: +123-456-7890</li>
                                                    <li><span class="icon-note"></span>Supportus@Eco greenteam.com</li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* <!--Footer Column--> */}
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <div class="footer-widget link-column">
                                                <div class="section-title">
                                                    <h4>Quick Links</h4>
                                                </div>
                                                <div class="widget-content">
                                                    <ul class="list">
                                                        <li><a href="about.html">About Our Eco green</a></li>
                                                        <li><a href="Eco-System.html">Eco System</a></li>
                                                        <li><a href="Organic-Living.html">Organic Living</a></li>
                                                        <li><a href="Good-Nature">Good Nature</a></li>
                                                        <li><a href="testimonial">Testimonials</a></li>
                                                        <li><a href="Events.html">Upcoming Events</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!--Big Column--> */}
                                <div class="big-column col-md-6 col-sm-12 col-xs-12">
                                    <div class="row clearfix">

                                        {/* <!--Footer Column--> */}
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <div class="footer-widget post-column">
                                                <div class="section-title">
                                                    <h4>Upcoming Events</h4>
                                                </div>
                                                <div class="post-list">
                                                    <div class="post">
                                                        <div class="post-thumb"><a href="#"><img src="images/blog/thumb1.jpg" alt=""/></a></div>
                                                        <a href="#"><h5>Marathon 2017: <br/>Run for Cancer People</h5></a>
                                                        <div class="post-info"><i class="fa fa-calendar"></i>  15 Mar, 2017</div>
                                                    </div>
                                                    <div class="post">
                                                        <div class="post-thumb"><a href="#"><img src="images/blog/thumb2.jpg" alt=""/></a></div>
                                                        <a href="#"><h5>Let’s walk to the poor <br/>children edu...</h5></a>
                                                        <div class="post-info"><i class="fa fa-calendar"></i> 21 Apr, 2017</div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                        {/* <!--Footer Column--> */}
                                        <div class="col-md-6 col-sm-6 col-xs-12">
                                            <div class="footer-widget contact-column">
                                                <div class="section-title">
                                                    <h4>Subscribe Us</h4>
                                                </div>
                                                <h5>Subscribe to our newsletter!</h5>
                                                <form action="#">
                                                    <input type="email" placeholder="Email address...."/>
                                                    <button type="submit"><i class="fa fa-paper-plane"></i></button>
                                                </form>
                                                <p>We don’t do mail to spam and your mail <br/>id is confidential.</p>

                                                <ul class="social-icon">
                                                    <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-feed"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-skype"></i></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
                <section class="footer-bottom">
                    <div class="container">
                        <div class="pull-left copy-text">
                            <p><a href="https://massenergize.org">Copyrights © 2019</a> All Rights Reserved. Powered by <a href="https://massenergize.org">MassEnergize</a></p>

                        </div>
                        <div class="pull-right get-text">
                            <a href="#">Join Us Now!</a>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
export default Footer;