package simple.graphene;

import java.util.List;
import org.openqa.selenium.WebElement;

/**
 * 
 * @author ldimaggi 
 * Simple/POC/throw-away test using arquillian Graphene for
 *         http://demo.almighty.io
 *
 */

public class TestSupport {

	/**
	 * Is the element in the List of WebElements?
	 * 
	 * @return boolean
	 */
	public static boolean findElementInList(List<WebElement> elementList, String searchString) {
		boolean found = false;
		for (WebElement e : elementList) {
			if (e.getText().contains(searchString)) {
				found = true;
				break;
			}
		}
		return found;
	}

}
