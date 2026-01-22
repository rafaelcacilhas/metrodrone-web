<script>
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import SoundLab from './SoundLab.svelte';

</script>

	<NavigationMenu.Root class="absolute top-0 left-45/100">
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Sound Lab</NavigationMenu.Trigger>
				<NavigationMenu.Content>
          <SoundLab />
        </NavigationMenu.Content>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>