
//init datasource
const data_source = new DataSource();
data_source.getData();


  // instantiate class
const sidebarHandler = new SidebarButtonHandler(
    "filterToggle",
    "graphsToggle",
    "exportToggle",
    "askToggle"
);

const search = new Search();  // instantiate class
