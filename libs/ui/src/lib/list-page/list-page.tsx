import React from 'react';
import { List, useTheme } from 'react-native-paper';
import Spacing from '../spacing/spacing';
import { ScrollView } from 'react-native';

export interface ListItem<ID_TYPE> {
  id: ID_TYPE;
  title?: string;
  description: string;
}

export interface ListPageProps<ID_TYPE = number> {
  title: string;
  editMode: boolean;
  items: ListItem<ID_TYPE>[];
  onRemove: (id: ID_TYPE) => void;
  onGoToDetails: (id: ID_TYPE) => void;
  testID?: string;
}

export function ListPage<ID_TYPE = number>({
  title,
  editMode,
  items,
  onRemove,
  onGoToDetails,
  testID,
}: ListPageProps<ID_TYPE>) {
  const theme = useTheme();
  return (
    <Spacing testID={testID}>
      <ScrollView>
        <List.Section>
          {items.map((item) => (
            <List.Item
              key={item.id as any}
              title={item.title}
              descriptionNumberOfLines={3}
              description={item.description}
              left={() =>
                editMode && (
                  <List.Icon color={theme.colors.error} icon="minus-circle" />
                )
              }
              right={(props) =>
                !editMode && <List.Icon {...props} icon="chevron-right" />
              }
              onPress={() =>
                editMode ? onRemove(item.id) : onGoToDetails(item.id)
              }
            />
          ))}
        </List.Section>
      </ScrollView>
    </Spacing>
  );
}

export default ListPage;
