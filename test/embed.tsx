import Diseact from '..';

const embed = (
	<embed color='White'>
		<author url='https://example.com/' iconURL='https://example.com/'>John</author>
		<title>My Embed</title>
		<description>Testing this embed</description>
		<fields>
			<field name="tested" inline>true</field>
		</fields>
		<image>https://example.com/</image>
		<thumbnail>https://example.com/</thumbnail>
		<footer iconURL='https://example.com/'>footer</footer>
	</embed>
)

console.log(embed)