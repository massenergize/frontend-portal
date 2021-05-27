export default class MEAnimation { 


  
  static getRandomIntegerInRange = (range) => {
    return Math.floor(Math.random() * Math.floor(range));
  };
  static getAnimationClass() {
    const classes = ["me-open-in", "me-open-in-slower", "me-open-in-slowest"]; // predefined classess in CSS (extras.css)
    const index = MEAnimation.getRandomIntegerInRange(3);
    return classes[index];
  }
}