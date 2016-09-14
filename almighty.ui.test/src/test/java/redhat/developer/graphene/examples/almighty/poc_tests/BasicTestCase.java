package simple.graphene;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.InitialPage;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.WebDriver;

/**
 * 
 * @author ldimaggi Simple/POC/throw-away test using arquillian Graphene for
 *         http://demo.almighty.io
 *
 */

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(Arquillian.class)
public class BasicTestCase {

	@Drone
	static WebDriver driver;

	@BeforeClass
	public static void prepareTest() throws Exception {
		String testUrl = System.getProperty("test.url", "http://localhost:8088");
		driver.get(testUrl);
	}

	@Before
	public void prepareEachTest() throws Exception {
	}

	@AfterClass
	public static void closeTest() throws Exception {
		driver.close();
	}

	@After
	public void closeEachTest() throws Exception {
	}

	/**
	 * Query the card display for the expected card to be there
	 * 
	 * @param page
	 * @throws InterruptedException
	 */
	@Test
	@RunAsClient
	public void test2_Board(@InitialPage BoardPage page) throws InterruptedException {
		/* TODO Replace all sleep statements with GuiWait */
		Thread.sleep(3000l);
		org.junit.Assert.assertTrue("We did not find Todd's card",
				TestSupport.findElementInList(page.getAllCardsOnPage(), "Hello Todd"));
	}

	/**
	 * Create a new work item - verify that is is saved.
	 * 
	 * @param page
	 * @throws InterruptedException
	 */
	@Test
	@RunAsClient
	public void test1_WorkItemList(@InitialPage WorkItemListPage page) throws InterruptedException {
		page.setWorkitemTitle("Hello Todd");
		page.setWorkitemDescription("Hello Description");
		page.saveWorkItem();
		org.junit.Assert.assertTrue("We did not find Todd's work item",
				TestSupport.findElementInList(page.getAllWorkItemsOnPage(), "Hello Todd"));
	}

	/**
	 * Verify that the correct URL is opened
	 */
	@Test
	@RunAsClient
	public void test0_OpeningHomePage() {
		String pageTitle = driver.getTitle();
		Assert.assertEquals(pageTitle, "ALMighty");
	}

}
