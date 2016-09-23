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
 * This class supports access to the board page
 *
 */

@Location("http://localhost:8088/#/board")
public class BoardPage {
 
    @Drone
    private WebDriver browser;

    /* TODO
     * Request that web UI elements are identified by unique id's
     */
    
    @FindBy(xpath = "//my-app/my-board/div")
    private WebElement allTextOnPage;
    
    @FindBy(xpath = ".//*[@id='search-box']")
    private WebElement searchBox;     

    private By allCardsSelector = By.xpath("//my-app/my-board/div/div/div");   
   
    /**
     * 
     * @return All cards on the page
     * TODO implement methods to return selective data from page
     */
    public List<WebElement> getAllCardsOnPage () {  
        List<WebElement> myElements = browser.findElements(allCardsSelector);
    	return myElements;
    }    
  
    
}

