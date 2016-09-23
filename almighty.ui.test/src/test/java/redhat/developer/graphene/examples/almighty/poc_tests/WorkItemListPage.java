package simple.graphene;

import java.util.List;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * 
 * @author ldimaggi
 * Simple/POC/throw-away test using arquillian Graphene for http://demo.almighty.io
 * 
 * This class supports access to the work-item-list page
 *
 */

@Location("http://localhost:8088/#/work-item-list")
public class WorkItemListPage {
	
    @Drone
    private WebDriver browser;

    /* TODO
     * Request that web UI elements are identified by unique id's
     */
    @FindBy(xpath = "//my-app/work-item-list/div/div/div[1]/div/work-item-quick-add/div/div/div[2]/div/input")
    private WebElement workitemTitle;
    
    @FindBy(xpath = "//my-app/work-item-list/div/div/div[1]/div/work-item-quick-add/div/div/div[3]/div/input")
    private WebElement workitemDescription;
    
    @FindBy(xpath = "//my-app/work-item-list/div/div/div[1]/div/work-item-quick-add/div/div/div[4]/div/a[1]")
    private WebElement saveButton;

    private By allWorkItemsSelector = By.xpath("//my-app/work-item-list/div/div/div");
    
    /**
     * 
     * @return All work items on the page
     * TODO implement methods to return selective data from page
     */
    public List<WebElement> getAllWorkItemsOnPage () {  
        List<WebElement> myElements = browser.findElements(allWorkItemsSelector);
    	return myElements;
    }    
    
    /**
     * 
     * @return String in work item title field.
     */
    public String getWorkitemTitle () {
    	return workitemTitle.getText();
    }
    
    /**
     * Set the value of the work item title field
     * @param title
     */
    public void setWorkitemTitle (String title) {
    	workitemTitle.sendKeys(title);
    }
    
    /**
     * 
     * @return String in work item description field
     */
    public String getWorkitemDescription () {
    	return workitemDescription.getText();
    }
    
    /**
     * Set the value of the work item description field
     * @param description
     */
    public void setWorkitemDescription (String description) {
    	workitemDescription.sendKeys(description);
    }
    
    /**
     * Click the save button to save the newly entered work item.
     * @throws InterruptedException 
     */
    public void saveWorkItem () throws InterruptedException {    	
    	/* TODOReplace sleep statement with a wait for the newly entered element to appear */ 
    	int beforeSave = getAllWorkItemsOnPage().size();
    	saveButton.click();    	
    	if ((new Integer(getAllWorkItemsOnPage().size()).equals(beforeSave))) {    	
    		Thread.sleep(5000l);
    	}
    }
       
}