import Search from 'flarum/components/Search';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import ItemList from 'flarum/utils/ItemList';
import classList from 'flarum/utils/classList';
import icon from 'flarum/helpers/icon';
import UsersSearchSource from './UsersSearchResults';

export default class ChatSearchUser extends Search
{
	sourceItems() 
	{
		const items = new ItemList();
		this.store = {};
		if (app.forum.attribute('canViewUserList')) items.add('users', new UsersSearchSource({callback: this.props.callback, store: this.store}));
	
		return items;
	}

	view() {
		const currentSearch = this.getCurrentSearch();
	
		// Initialize search input value in the view rather than the constructor so
		// that we have access to app.current.
		if (typeof this.value() === 'undefined') {
			this.value(currentSearch || '');
		}
	
		// Initialize search sources in the view rather than the constructor so
		// that we have access to app.forum.
		if (!this.sources) {
			this.sources = this.sourceItems().toArray();
		}
	
		// Hide the search view if no sources were loaded
		if (!this.sources.length) return <div></div>;
	
		return (
			<div className={'Search ' + classList({
				open: this.hasFocus,
				active: !!currentSearch,
				loading: !!this.loadingSources
			})}>
				<div className="Search-input SearchInput">
					<input className="FormControl"
						type="search"
						placeholder={app.translator.trans('pushedx-chat.forum.chat.list.preview.add_modal.search.placeholder')}
						value={this.value()}
						oninput={m.withAttr('value', this.value)}
						onfocus={() => this.hasFocus = true}
						//onblur={() => this.hasFocus = false}
					/>
					{this.loadingSources
					? LoadingIndicator.component({size: 'tiny', className: 'Button Button--icon Button--link'})
					: currentSearch
					? <button className="Search-clear Button Button--icon Button--link" onclick={this.clear.bind(this)}>{icon('fas fa-times-circle')}</button>
					: ''}
				</div>
				{this.value() && this.hasFocus ?
					<ul className="Dropdown-menu Dropdown--Users">
						{this.sources.map(source => source.view(this.value()))}
					</ul> 
					: null}
			</div>
		);
	  }
}