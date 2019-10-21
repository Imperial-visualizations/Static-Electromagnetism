// Code for navigation functionality in visualisations main screen using Vue

let this = new Vue({

    el: "#this",

    data: {
        // Data required including variables associated with visible sections, script paths and booleans reflecting state of vis
        scrollPos: 0,
        currentTitle: 0,
        currentSection: 0,
        sectionTops: [],
        sectionBottoms: [],
        sectionTitleLong: ["Introduction", "Gauss's Law", "Gauss's Magnetism Law ", "Ampere's Law", "Circulation Law", "Electric Potential/Field", "Conclusion"],
        sectionTitleShort: ["1", "2", "3", "4", "5", "6", "7"],
        sectionTitle: [],
        hoverPos: '',
        hoverTitle: false,
        mouseX: '',
        n: "",
        journeyHeightOld: "",
        journeyHeightNew: "",
        firstRunDone: false,
        subSection: [false, 1, 1, 1, 1, 1, 1],
        subSubSection: 1,
        subSubSubSection: 0,
    },

    methods: {

        // Function called on scrolling of of left panel to indicate distance scrolled down journey content div
        scrollFunc: function () {
            // function only works once sectionPos has run at least once (in mounted)
            if (this.firstRunDone === true) {
                this.scrollPos = document.querySelectorAll(".journey")[0].scrollTop;
                this.changeTitle();
                this.changeSec();
            }
        },

        handleElement: function (section) {
            // update currentSection variable if user scrolls past the top edge of its corresponding section on left side
            if (this.scrollPos >= this.sectionTops[section - 1] && this.scrollPos < this.sectionBottoms[section - 1]) {
                this.currentTitle = section;
            }
        },

        changeTitle: function () {
            for (let i = 1; i <=this.n; i++) {
               this.handleElement(i)
            }
        },

        changeSec: debounce(function () {
           this.currentSection =this.currentTitle;
        }, 200),

        swapTitles: function (newValue, oldValue) {
            for (let i = 1; i <=this.n; i++) {
                if (i !== newValue) {
                   this.sectionTitle[i - 1] =this.sectionTitleShort[i - 1];
                } else {
                    setTimeout(function () {
                       this.sectionTitle[i - 1] =this.sectionTitleLong[i - 1];
                    }, 20);
                    setTimeout(function () {
                       this.$forceUpdate();
                    }, 100);
                }
            }
        },

        // Function called every x seconds to check if section div sizes have changed and recalculate scroll positions if so
        // Div sizes may change if window re-sized or if a subsection is expanded/collapsed
        sectionPos: function () {
            this.$nextTick(function () {
                let overallTop = document.querySelectorAll("#sc1")[0].offsetTop;
                for (let i = 1; i <= this.n; i++) {
                    if (i < this.n) {
                        this.sectionTops[i - 1] = (document.querySelectorAll("#" + "sc" + i)[0].offsetTop - overallTop);
                        this.sectionBottoms[i - 1] = (this.sectionTops[i - 1] + document.querySelectorAll("#" + "sc" + i)[0].offsetHeight);
                    } else {
                        this.sectionTops[i - 1] = (document.querySelectorAll("#" + "sc" + i)[0].offsetTop - overallTop);
                        this.sectionBottoms[i - 1] = (this.sectionTops[i - 1] + document.querySelectorAll("#" + "sc" + i)[0].offsetHeight - document.querySelectorAll(".journey")[0].offsetHeight);
                    }
                }
                this.firstRunDone = true;
                this.scrollFunc();
            })
        },

        // Function activated when button in nav/progress bar clicked to scroll automatically to relevant section
        scrollTo: function (event) {
            document.querySelectorAll("#" + "ph" + event.currentTarget.dataset.no + " " + "hr")[0].scrollIntoView({behavior: "smooth"});
        },

        // Same as above but for subsections (and sub-subsections)
        subScrollTo: function (section) {
            if (this.currentSection !== section) {
                let scrollTarget = document.querySelectorAll("#ph" + section)[0];
                scrollTarget.scrollIntoView({behavior: "smooth"});
            }
        },

        // Same as above but for sub-sub-subsections
        subSubSubScrollTo: function (event) {
            let scrollTarget = event.currentTarget;
            if (scrollTarget.id === "eg" + this.subSubSubSection) {
                scrollTarget.scrollIntoView();
            }
        },

        // Updates active example in Section 4 Sub 2 Examples Section
        updateSubSubSubSection: function (section) {
            if (this.subSubSubSection !== section) {
                this.subSubSubSection = section;
            }
            else {
                this.subSubSubSection = 0;
            }
        },

        // Updates number of title being hovered over in nav/progress bar in data
        hoverPosUpdate: function (event) {
            this.hoverPos = parseFloat(event.currentTarget.dataset.no)
        },

        // Updates if and what title show when hovering over nav/progress bar
        selectHover: function () {
            if (this.currentTitle !== this.hoverPos) {
                this.hoverTitle = this.sectionTitleLong[this.hoverPos - 1]
            } else {
                this.hoverTitle = false
            }
        },

        // Updates x-position of mouse in data
        updateMouseX: function (event) {
            // pass event object, bound to mouse move with update
            this.mouseX = event.clientX - 15;
        },

        // Toggles button text from 'hide' to 'show' depending on state
        hideShowToggle: function (event) {
            let toggleTarget = event.currentTarget.querySelectorAll('span')[0].innerHTML;
            if (toggleTarget === "Show") {
                event.currentTarget.querySelectorAll('span')[0].innerHTML = "Hide"
            } else {
                event.currentTarget.querySelectorAll('span')[0].innerHTML = "Show"
            }
        },
    },

    watch: {

        // Updates current section title to display in full in nav/progress bar whilst minimising other section titles
        currentTitle: function (newValue, oldValue) {
            this.swapTitles(newValue, oldValue)
        },
    },

    mounted() {
        // $nextTick ensures initial functions only run once Vue is initialised sufficiently
        this.$nextTick(function () {
            // makes n equal to total number of sections
            this.n = document.querySelectorAll(".section-container").length;
            // calculates initial div section positions in journey with respect to the top
            this.sectionPos();
            // checks if journey div height changes every x seconds
            // if it does change, re-runs sectionPos to calculate section div positions
            this.journeyHeightOld = document.querySelectorAll(".journey")[0].scrollHeight;
            window.setInterval(() => {
                this.journeyHeightNew = document.querySelectorAll(".journey")[0].scrollHeight;
                if (this.journeyHeightOld !== this.journeyHeightNew) {
                    this.journeyHeightOld = this.journeyHeightNew;
                    this.sectionPos();
                }
            }, 2000);
            // collapses collapsible divs once mathJax has loaded fully
            setTimeout(function () {
                MathJax.Hub.Queue(function () {
                    let collapseDivs = document.querySelectorAll(".collapse");
                    let collapseButtons = document.querySelectorAll(".egButton");
                    for (let i = 0; i < collapseDivs.length; i++) {
                        collapseDivs[i].classList.remove("show");
                        collapseButtons[i].classList.add("collapsed");
                    }
                })
            }, 1000);
        })
    },
});